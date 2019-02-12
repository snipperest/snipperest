const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boardSchema = new Schema({
  creator: { type: Schema.Types.ObjectId, ref: "User" },
  name: String,
  snippets: Array,
},
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  })

const Board = mongoose.model("Board", boardSchema)

module.exports = Board