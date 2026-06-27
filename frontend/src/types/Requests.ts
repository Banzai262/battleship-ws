export interface CreateGameRequest {
    type: string; // TODO surement une enum
    player_name: string;
}

export interface CreateGameResponse {
    type: string; // TODO surement une enum
    code: string;
}

export interface JoinGameRequest {
    type: string; // TODO surement une enum
    player_name: string;
    code: string;
}

export interface JoinGameResponse {
    type: string; // TODO surement une enum
    code: string;
}