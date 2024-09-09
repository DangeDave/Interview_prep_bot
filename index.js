require('dotenv').config();
const { Bot, Keyboard, InlineKeyboard, GrammyError, HttpError } = require('grammy');

const bot = new Bot(process.env.BOT_API_KEY);

bot.command('start', async (ctx) => {
    const startKeyboard = new Keyboard()
			.text('HTML')
			.text('CSS')
            .row()
			.text('JavaScript')
			.text('React')
            .resized();
    await ctx.reply('Привет,  я помогу тебе подготовится к собесам на фронта');
    await ctx.reply('С чего начнем, выберите тему в меню:', {reply_markup: startKeyboard})
    
});

bot.on('callback_query:data', async (ctx) => {
    if(ctx.callbackQuery.data === 'cancel') {
        await ctx.reply('Отменено');
        await ctx.answerCallbackQuery();
        return
    }
    const callbackData = JSON.parse(ctx.callbackQuery.data);
    await ctx.reply(`${callbackData.type} - составляющая фронтенда`)
    await ctx.answerCallbackQuery();
})

bot.hears(['HTML', 'CSS', 'JavaScript', 'React'], async ctx => {
    const inlineKeyboard = new InlineKeyboard()
			.text('Получить ответ', JSON.stringify({type: ctx.message.text, questionId: 1}))
			.text('Отменить', 'cancel');
	await ctx.reply(`Что такое ${ctx.msg.text}?`, {
		reply_markup: inlineKeyboard,
	});
});

bot.catch(err => {
	const ctx = err.ctx;
	console.error(`Error while handling update ${ctx.update.update_id}:`);
	const e = err.error;
	if (e instanceof GrammyError) {
		console.error('Error in request:', e.description);
	} else if (e instanceof HttpError) {
		console.error('Could not contact Telegram:', e);
	} else {
		console.error('Unknown error:', e);
	}
});

bot.start();
