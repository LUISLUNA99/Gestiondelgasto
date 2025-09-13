#!/usr/bin/env python3
import pandas as pd
import sys

def generar_inserts_limpio():
    try:
        # Leer el archivo Excel
        excel_file = 'CatalogodeCuentas.xlsx'
        
        # Obtener nombres de las hojas
        xl = pd.ExcelFile(excel_file)
        
        # Leer cada hoja
        for sheet_name in xl.sheet_names:
            df = pd.read_excel(excel_file, sheet_name=sheet_name)
            
            # Renombrar columnas para que sean válidas en SQL
            column_mapping = {
                'Nivel': 'nivel',
                '  C ó d i g o': 'codigo',
                'N o m b r e': 'nombre',
                'T i p o': 'tipo',
                'TIPO 2': 'tipo_2',
                'Dig/Agr': 'dig_agr',
                'Edo/Fin': 'edo_fin',
                'Moneda': 'moneda',
                'Seg/Neg': 'seg_neg',
                'Rubro/NIF': 'rubro_nif',
                'Agrupador/SAT': 'agrupador_sat'
            }
            
            df = df.rename(columns=column_mapping)
            
            # Filtrar solo las filas que tienen datos válidos
            # Excluir filas de resumen y filas vacías
            df_clean = df.dropna(subset=['nivel', 'codigo'])
            
            # Filtrar filas que no sean datos reales (excluir resúmenes)
            df_clean = df_clean[
                (df_clean['nivel'].astype(str).str.isdigit()) &  # Nivel debe ser numérico
                (df_clean['codigo'].astype(str).str.contains('-', na=False)) &  # Código debe contener guión
                (~df_clean['nombre'].astype(str).str.contains('Total de cuentas|Cuentas de|Relación de', na=False))  # Excluir resúmenes
            ]
            
            print(f"-- Insertar cuentas contables de {sheet_name}")
            print(f"-- Total de registros válidos: {len(df_clean)}")
            print("INSERT INTO cuentas_contables (")
            print("nivel, codigo, nombre, tipo, tipo_2, dig_agr, edo_fin, moneda, seg_neg, rubro_nif, agrupador_sat, empresa")
            print(") VALUES")
            
            # Generar valores solo para filas con datos válidos
            for index, row in df_clean.iterrows():
                valores = []
                for col in df.columns:
                    valor = row[col]
                    if pd.isna(valor) or valor == '' or str(valor).strip() == '':
                        valores.append('NULL')
                    else:
                        # Escapar comillas simples
                        valor_str = str(valor).replace("'", "''")
                        valores.append(f"'{valor_str}'")
                
                # Agregar empresa
                empresa = 'BUZZWORD' if 'Buzz' in sheet_name else 'INOVITZ'
                valores.append(f"'{empresa}'")
                
                # Agregar coma si no es el último
                if index < len(df_clean) - 1:
                    print(f"({', '.join(valores)}),")
                else:
                    print(f"({', '.join(valores)});")
            
            print()
            
    except Exception as e:
        print(f'Error: {e}')
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    generar_inserts_limpio()
