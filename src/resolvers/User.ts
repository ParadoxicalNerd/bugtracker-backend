import { PrismaClient } from '@prisma/client'

interface Context {
    prisma: PrismaClient
}

export default {
    ticketsAuthored: (parent: { id: string }, _args: any, context: Context) => (
        context.prisma.user.findFirst({ where: { id: parent.id } }).ticketsAuthored()
    ),
    createdProjects: (parent: { id: string }, _args: any, context: Context) => (
        context.prisma.user.findFirst({ where: { id: parent.id } }).createdProjects()
    ),
    assignedTickets: (parent: { id: string }, _args: any, context: Context) => (
        context.prisma.user.findFirst({ where: { id: parent.id } }).assignedTickets()
    ),
    comments: (parent: { id: string }, _args: any, context: Context) => (
        context.prisma.user.findFirst({ where: { id: parent.id } }).comments()
    ),
    associatedProjects: (parent: { id: string }, _args: any, context: Context) => (
        context.prisma.user.findFirst({ where: { id: parent.id } }).associatedProjects()
    ),
}