"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    ticketsAuthored: (parent, _args, context) => (context.prisma.user.findFirst({ where: { id: parent.id } }).ticketsAuthored()),
    createdProjects: (parent, _args, context) => (context.prisma.user.findFirst({ where: { id: parent.id } }).createdProjects()),
    assignedTickets: (parent, _args, context) => (context.prisma.user.findFirst({ where: { id: parent.id } }).assignedTickets()),
    comments: (parent, _args, context) => (context.prisma.user.findFirst({ where: { id: parent.id } }).comments()),
    associatedProjects: (parent, _args, context) => (context.prisma.user.findFirst({ where: { id: parent.id } }).associatedProjects()),
};
//# sourceMappingURL=User.js.map