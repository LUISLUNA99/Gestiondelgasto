#!/usr/bin/env python3
import pandas as pd
import sys

def generar_sql_cuentas():
    try:
        # Leer el archivo Excel
        excel_file = 'CatalogodeCuentas.xlsx'
        
        # Obtener nombres de las hojas
        xl = pd.ExcelFile(excel_file)
        print('Hojas disponibles:', xl.sheet_names)
        
        # Leer cada hoja
        for sheet_name in xl.sheet_names:
            print(f'\n=== HOJA: {sheet_name} ===')
            df = pd.read_excel(excel_file, sheet_name=sheet_name)
            print(f'Filas: {len(df)}, Columnas: {len(df.columns)}')
            print('Columnas originales:', list(df.columns))
            
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
            print('Columnas renombradas:', list(df.columns))
            
            # Filtrar solo las filas que tienen datos válidos (no nulos en la primera columna)
            df_clean = df.dropna(subset=[df.columns[0]])
            print(f'Filas con datos válidos: {len(df_clean)}')
            
            # Generar SQL para esta hoja
            empresa = sheet_name.upper()
            print(f'\n--- SQL para {empresa} ---')
            
            # Crear tabla si es la primera hoja
            if sheet_name == xl.sheet_names[0]:
                print("-- Crear tabla de cuentas contables")
                print("DROP TABLE IF EXISTS cuentas_contables CASCADE;")
                print("CREATE TABLE cuentas_contables (")
                print("  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,")
                
                # Agregar columnas basadas en las columnas del Excel
                for col in df.columns:
                    if col == 'nivel':
                        print(f"  {col} VARCHAR(10),")
                    elif col == 'codigo':
                        print(f"  {col} VARCHAR(50) NOT NULL,")
                    elif col == 'nombre':
                        print(f"  {col} VARCHAR(500),")
                    else:
                        print(f"  {col} VARCHAR(200),")
                
                print("  empresa VARCHAR(20) NOT NULL CHECK (empresa IN ('BUZZWORD', 'INOVITZ')),")
                print("  activo BOOLEAN DEFAULT true,")
                print("  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()")
                print(");")
                print()
            
            # Generar INSERTs para esta hoja
            print(f"-- Insertar cuentas contables de {empresa}")
            print("INSERT INTO cuentas_contables (")
            
            # Columnas del Excel + empresa
            columnas_sql = list(df.columns) + ['empresa']
            print(", ".join(columnas_sql))
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
    generar_sql_cuentas()
