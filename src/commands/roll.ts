import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:roll_command');

const roll = () => async (ctx: Context) => {
  const message = rollDiceLogic(ctx.text || '', `${ctx.message?.from.first_name}`) || 'Invalid roll command format. Use XdY or XdYdZ (e.g., 3d6 or 4d10d7).';
  debug(`Triggered "roll" command with message \n${message}`);
  await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
};
const r = () => async (ctx: Context) => {
  await roll()(ctx);
};


const rollDiceLogic = (input: string, name: string) =>{
        let sb = ''; 
        if (!input) return null; 

        input = input.toLowerCase().trim();
        const dPosition = input.indexOf('d');
        if (dPosition === -1) {
            return null;
        }

        const numbers = input.split("d");
        
        let numberStr = numbers[0];
        
        //remove /roll or /r
        if (numberStr.includes(' ')) {
            numberStr = numberStr.split(' ')[1];
        }
        //remove "/" if present
        if (numberStr.startsWith('/')) {
            numberStr = numberStr.substring(1);
        }
        
        let number: number;
        let faces: number;
        let difficulty: number = -1;

        // La gestione degli errori di parsing lancia un'eccezione
        // che viene catturata da onMessageRoll o onInlineQuery.
        number = parseInt(numberStr, 10);
        faces = parseInt(numbers[1], 10);
        if (numbers.length >= 3) {
            difficulty = parseInt(numbers[2], 10);
        }

        if (isNaN(number) || isNaN(faces) || number <= 0 || faces <= 0) {
            throw new Error("invalid dice values");
        }

        let sum = 0;
        let success = 0;
        let criticalCheck = true; // Se resta true e success < 0, è critico.
        
        for (let i = 0; i < number; i++) {
            const roll = rollDice(faces);
            sum += roll;
            sb += `${roll} `; 
            
            if (difficulty > -1) { 
                if (difficulty <= roll) {
                    success++;
                    criticalCheck = false; 
                }
                success += (roll === 1) ? -1 : 0; 
            }
        }
        
        sb = sb.trim(); // Rimuove lo spazio finale
        sb += ` (sum: ${sum})`;
        
        if (difficulty > -1) { 
            sb += ` (success: ${success})`;
        }
        
        // check su fallimento critico
        if (difficulty > -1 && success < 0 && criticalCheck) {
            sb += " *CRITICAL FAILURE!!!*";
        }

        return sb.trim();
    }

    // Corrisponde a private static int rollDice(int faces)
    const rollDice = (faces: number) => {
        return Math.floor(((Math.random() * 47 * 100) % faces) + 1);
    }

export { roll, r };
