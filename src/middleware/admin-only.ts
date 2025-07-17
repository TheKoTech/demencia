import { type Context, type Middleware } from 'telegraf'
import Bot from '../bot'

export const adminOnly: Middleware<Context> = async (ctx, next) => {
	if (ctx.from?.id && Bot.admins?.includes(String(ctx.from?.id))) {
		return next()
	}
}
