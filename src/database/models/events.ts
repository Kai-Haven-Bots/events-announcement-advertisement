import { Sequelize, INTEGER, STRING, CHAR } from "sequelize";

export const model = (sequelize: Sequelize) => {
    sequelize.define('events', {
        name: {
            type: STRING
        },
        time: {
            type: INTEGER
        },
        channelId: {
            type: CHAR(25)
        }
    }, {timestamps: false})
}