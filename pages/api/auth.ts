import {NextApiRequest, NextApiResponse} from "next";
import { serialize, CookieSerializeOptions } from 'cookie'
import axios from "axios";

export const setCookie = (
  res: NextApiResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {}
) => {
  const stringValue =
    typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value)

  if (options && options['maxAge'] && 'maxAge' in options) {
    options.expires = new Date(Date.now() + options.maxAge)
    options.maxAge /= 1000
  }

  res.setHeader('Set-Cookie', serialize(name, stringValue, options))
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const {email, password} = req.body;
  const authRes = await axios.post('https://todo-backend-nest-js-sdja8.ondigitalocean.app/auth/login', {email, password},)
  return res.json({...authRes.data})
}