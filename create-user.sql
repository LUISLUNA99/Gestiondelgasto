-- Crear usuario luis.luna@grupocsi.com en Supabase Auth
-- Ejecutar este comando en el SQL Editor de Supabase

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'luis.luna@grupocsi.com',
  crypt('987654321', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Verificar que el usuario se creó correctamente
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'luis.luna@grupocsi.com';
