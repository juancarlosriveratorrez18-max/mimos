//VARIABLES DE ENTORNO
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

//creacion de la conexion a supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

//variables de conexion
if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Error: Las variables de entorno SUPABASE_URL y SUPABASE_KEY no están definidas.");
    process.exit(1); 
}

// conexion a supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

export const conectaDB = () => {
    console.log ("✅ Conexión a Supabase establecida correctamente.");
};
