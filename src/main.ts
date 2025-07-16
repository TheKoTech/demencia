import 'dotenv/config'
import { Telegraf } from 'telegraf'

if (!process.env.BOT_TOKEN) {
	throw new Error(
		'BOT_TOKEN environment variable is not set.\n' +
			'Create a `.env` file and write `BOT_TOKEN=your-token-here` in it.',
	)
}

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.hears(/^\/ping/, async ctx => {
	ctx.reply('pong')
})

bot
	.catch((error, ctx) => {
		// @ts-expect-error weh
		if (error?.response?.description === 'Bad Request: TOPIC_CLOSED') {
			console.log('Some one tried to @all in a closed topic.')
			return
		}

		return console.error(error, ctx)
	})
	.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
