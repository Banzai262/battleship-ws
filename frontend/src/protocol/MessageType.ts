export enum RequestTypes {
    Create = "create",
    Join = "join",
    Place = "place",
    PlaceRandom = "place_random",
    Fire = "fire",
    GetState = "get_state",
}

export enum ResponseTypes {
    GameCreated = "game_created",
    GameReady = "game_ready",
    Joined = "joined",
    State = "state",
    Error = "error",
    Notification = "notification",
    Log = "log"
}

export interface Request {
    type: RequestTypes
}

export interface Response {
    type: ResponseTypes
}