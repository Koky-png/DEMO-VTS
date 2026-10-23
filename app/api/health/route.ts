import {NextResponse} from 'next/server';
export async function GET(){return NextResponse.json({ok:true,service:'liquor-store-starter',checkout:'not-activated',glovo:'not-activated'})}
