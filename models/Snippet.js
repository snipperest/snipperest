const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const snippetSchema = new Schema({
  title: String,
  language: String,
  code: String,
  description: String,
  pic: {
    picPath: String,
    picName: String
  },
  source: String,
  creator: { type: Schema.Types.ObjectId, ref: "User" }
},
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

const Snippet = mongoose.model("Snippet", snippetSchema)

module.exports = Snippet
