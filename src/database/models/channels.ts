import { Sequelize, INTEGER, STRING, CHAR } from "sequelize";

export const model = (sequelize: Sequelize) => {
    sequelize.define('channel', {
        channelId: {
            type:   CHAR(25),
            allowNull: false
        },
        lastSentAt: {
            type: INTEGER
    },
        msgId: {
            type: CHAR(25)
        }
    }, {timestamps: false})
}