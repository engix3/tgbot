const { Telegraf } = require('telegraf');
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

let userAvatarUrl = '/img/vaatartatar.png'; // fallback

// Когда ты отправишь боту фото — он сохранит его URL
bot.on('photo', async (ctx) => {
    const photo = ctx.message.photo.pop(); // берем самое большое фото
    const fileId = photo.file_id;

    try {
        // Получаем путь к файлу
        const file = await ctx.telegram.getFile(fileId);
        const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
        
        userAvatarUrl = fileUrl;
        console.log('✅ Аватарка обновлена:', fileUrl);

        await ctx.reply('Аватарка успешно обновлена на сайте!');
    } catch (error) {
        console.error('Ошибка при получении аватарки:', error);
        await ctx.reply('Не удалось обновить аватарку.');
    }
});

// Express API для сайта
const app = express();
app.use(cors());

app.get('/api/avatar', (req, res) => {
    res.json({ avatarUrl: userAvatarUrl });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`📡 API запущен на порту ${PORT}`);
    console.log(`🤖 Бот запущен. Отправь ему фото, чтобы обновить аватарку.`);
});

// Запуск бота
bot.launch();
