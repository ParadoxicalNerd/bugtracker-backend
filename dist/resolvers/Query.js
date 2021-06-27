"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    project: function (_parent, args, context) { return (context.prisma.project.findFirst({ where: { id: args.id } })); },
    ticket: function (_parent, args, context) { return (context.prisma.ticket.findFirst({ where: { id: args.id } })); },
    user: function (_parent, args, context) { return (context.prisma.user.findFirst({ where: { id: args.id } })); },
    allProjects: function (_parent, _args, context) { return (context.prisma.project.findMany()); },
    allUsers: function (_parent, _args, context) { return (context.prisma.user.findMany()); }
};
