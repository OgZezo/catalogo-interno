import { supabase } from './supabase';
import { RequestForm } from '../types';

export async function sendSolicitationEmail(form: RequestForm, buyerEmail: string) {
  // Chamamos a nossa função segura em vez de tentar fetch direto no Resend
  const { data, error } = await supabase.functions.invoke('send-solicitation', {
    body: { form, buyerEmail }
  });

  if (error) {
    console.error('Erro na função:', error);
    throw new Error('Não foi possível enviar a solicitação.');
  }

  return data;
}