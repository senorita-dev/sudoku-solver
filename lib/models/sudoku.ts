export type getSudokuResponse = {
    id: number; // id number
    mission: string; // 81 chars of 0-9
    solution: string; // 81 chars of 1-9
    win_rate: number; // 2 d.p.
}