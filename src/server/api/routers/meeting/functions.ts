'use server'
import { cookies } from 'next/headers'

export async function saveSetCookies(headers: any) {
  const text = headers["set-cookie"]![0].split(';')[0];

  cookies().set({
    name: 'JSESSIONID',
    value: text.split('=')[1],
    path: '/',
    httpOnly: true,
    secure: true,
  });
}