import { getSudokuResponse } from "@models/sudoku";
import { CyHttpMessages } from "node_modules/cypress/types/net-stubbing";

describe('Solve Sudoku after page load', () => {
    beforeEach(() => {
        cy.intercept('GET', 'api/level/easy').as('level');
        cy.visit('/');
    })
    it('Intercept GET /sudoku.com/api/level/easy', () => {
        cy.wait('@level').then((interception) => {
            const response = interception.response!;
            expect(response).to.exist;
            assertResponse(response);
            const { body }: { body: getSudokuResponse } = response;
            solveSudoku(body.mission, body.solution);
        })
    })
})
const assertResponse = (res: CyHttpMessages.IncomingResponse) => {
    const { body, statusCode }: { body: getSudokuResponse, statusCode: number } = res;
    expect(statusCode).to.deep.equal(200);
    expect(body).to.have.all.keys(["id", "mission", "solution", "win_rate"]);
    expect(body.id).to.be.a('number');
    expect(body.mission).to.be.a('string').and.to.have.length(81);
    expect(body.solution).to.be.a('string').and.to.have.length(81);
    expect(body.win_rate).to.be.a('number');
}
const solveSudoku = (mission: string, solution: string) => {
    cy.get('#game.game').then(($div) => {
        const width = $div.width()!;
        const height = $div.height()!;
        const marginalWidth = width / 9;
        const marginalHeight = height / 9;
        for (let i = 0; i < solution.length; i++) {
            if (mission.charAt(i) === '0') {
                const digit = solution.charAt(i);
                const x = i % 9 * marginalWidth;
                const y = Math.floor(i / 9) * marginalHeight;
                cy.get('#game.game').click(x, y).trigger('keydown', { force: true, keyCode: +digit + 48 });
            }
        }
    });
}