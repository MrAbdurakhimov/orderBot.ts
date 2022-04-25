import dotenv from "dotenv";
dotenv.config();

import { Bot, Context, Keyboard, session, SessionFlavor } from "grammy";

// Define the shape of our session.
interface SessionData {
  pizzaCount: number;
}

// Flavor the context type to include sessions.
type MyContext = Context & SessionFlavor<SessionData>;

const bot = new Bot<MyContext>(process.env.TOKEN || "");

// Install session middleware, and define the initial session value.
function initial(): SessionData {
  return { pizzaCount: 0 };
}
bot.use(session({ initial }));

const keyboard = new Keyboard().text("I am Hungry: 🍕");

bot.command("hunger", async (ctx) => {
  const count = ctx.session.pizzaCount;
  await ctx.reply(`Your hunger level is ${count}!`, {
    reply_markup: {
      resize_keyboard: true,
      keyboard: keyboard.build(),
    },
  });
});

bot.command("remove", async (ctx) => {
  await ctx.reply("Keyboard removed", {
    reply_markup: { remove_keyboard: true },
  });
});

bot.hears(/.*🍕.*/, async (ctx) => {
  ctx.session.pizzaCount++;
  const count = ctx.session.pizzaCount;
  await ctx.reply(`Your hunger level is ${count}!`, {
    reply_markup: {
      resize_keyboard: true,
      keyboard: keyboard.build(),
    },
  });
});

bot.start();
