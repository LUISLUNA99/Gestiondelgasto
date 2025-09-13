#!/usr/bin/env python3
import pandas as pd
import sys

def leer_excel_cuentas():
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
            print('Columnas:', list(df.columns))
            print('Primeras 10 filas:')
            print(df.head(10))
            print('\nTipos de datos:')
            print(df.dtypes)
            
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
                    col_name = col.lower().replace(' ', '_').replace('(', '').replace(')', '').replace('-', '_')
                    if 'codigo' in col_name or 'código' in col_name:
                        print(f"  {col_name} VARCHAR(50) NOT NULL,")
                    elif 'nombre' in col_name or 'descripcion' in col_name or 'descripción' in col_name:
                        print(f"  {col_name} VARCHAR(500),")
                    else:
                        print(f"  {col_name} VARCHAR(200),")
                
                print("  empresa VARCHAR(20) NOT NULL CHECK (empresa IN ('BUZZWORD', 'INOVITZ')),")
                print("  activo BOOLEAN DEFAULT true,")
                print("  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()")
                print(");")
                print()
            
            # Generar INSERTs para esta hoja
            print(f"-- Insertar cuentas contables de {empresa}")
            print("INSERT INTO cuentas_contables (")
            
            # Columnas del Excel + empresa
            columnas_excel = [col.lower().replace(' ', '_').replace('(', '').replace(')', '').replace('-', '_') for col in df.columns]
            columnas_sql = columnas_excel + ['empresa']
            print(", ".join(columnas_sql))
            print(") VALUES")
            
            # Generar valores
            for index, row in df.iterrows():
                valores = []
                for col in df.columns:
                    valor = row[col]
                    if pd.isna(valor):
                        valores.append('NULL')
                    else:
                        # Escapar comillas simples
                        valor_str = str(valor).replace("'", "''")
                        valores.append(f"'{valor_str}'")
                
                # Agregar empresa
                valores.append(f"'{empresa}'")
                
                # Agregar coma si no es el último
                if index < len(df) - 1:
                    print(f"({', '.join(valores)}),")
                else:
                    print(f"({', '.join(valores)});")
            
            print()
            
    except Exception as e:
        print(f'Error: {e}')
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    leer_excel_cuentas()
