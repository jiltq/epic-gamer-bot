import { SlashCommandBuilder } from '@discordjs/builders';

export class Command {
    public constructor(data: SlashCommandBuilder, execute: function);
    public data: SlashCommandBuilder;
    public execute: function;
}