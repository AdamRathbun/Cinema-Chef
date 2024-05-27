import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { createClient } from '@supabase/supabase-js';
import {
  ThemeSupa,
} from '@supabase/auth-ui-shared'
import './Auth.scss';
import { useNavigate } from 'react-router-dom';


const supabase = createClient('https://bwzptqnuytalrgtwhhim.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3enB0cW51eXRhbHJndHdoaGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM0NzIyMzEsImV4cCI6MjAyOTA0ODIzMX0.Lxr25RL-sNfN4_Xv8_Td3mjmMzTVtm4r6r4rerQVnhc')

const SupabaseAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        localStorage.setItem('authToken', session.access_token);
        navigate('/');
      } else {
        localStorage.removeItem('authToken');
      }
    });

  }, [navigate]);


  return (
    <div className='auth-container'>
      <div className='supabase-container'>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
        />
      </div>
    </div>
  );
};

export default SupabaseAuth;

