import { Context, Middleware } from 'telegraf'

const admins = process.env.ADMINS?.split(',') || []

export const adminOnly: Middleware<Context> = async (ctx, next) => {
	if (ctx.from?.id && admins.includes(String(ctx.from?.id))) {
		return next()
	}
}
