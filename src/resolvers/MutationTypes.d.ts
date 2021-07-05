export enum TicketTypes {
    Bug = 'BUG',
    Feature = 'FEATURE',
    Docs = 'DOCS'
}

export enum TicketStatus {
    Open = 'OPEN',
    Assigned = 'ASSIGNED',
    Testing = 'TESTING',
    Resolved = 'RESOLVED'
}

export enum TicketPriority {
    Unknown = 'UNKNOWN',
    Low = 'LOW',
    Medium = 'MEDIUM',
    High = 'HIGH',
    Critical = 'CRITICAL'
}


export interface ProjectCreateInput {
    title: string
    description: string
}

export interface ProjectUpdateInput {
    description: string
}

export interface TicketCreateInput {
    title: string
    description: string
    type: TicketTypes
    status: TicketStatus
    priority: TicketPriority
}

export interface TicketUpdateInput {
    description: string
    type: TicketTypes
    status: TicketStatus
    priority: TicketPriority
}

export interface UserCreateInput {
    name: string
    email: string
    type: UserType
}