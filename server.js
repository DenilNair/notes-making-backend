const moongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userSchema = require("./schemas/user-schemas");
const app = express();

const DB =
  "mongodb+srv://denil:deniL12345@cluster0.qeyfm.mongodb.net/Notes?retryWrites=true&w=majority";

var dbConn = moongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
// parse application/json
app.use(bodyParser.json());

app.get("/", function (request, response) {
  response.send("Hello Good Morning!");
});

//add new user
app.post("/store-data", (req, res) => {
  let data = { name: req.body.name };
  body_data = req.body;
  if (body_data.blocks != undefined) {
    block_data = body_data.blocks[0];
    if (block_data != undefined) {
      if (
        block_data.key != undefined &&
        block_data.text != undefined &&
        block_data.inlineStyleRanges != undefined
      ) {
        storeToMongo(body_data);
      } else {
        console.log(" if - if -ifelse");
        res.send("format error");
      }
    } else {
      console.log(" if - if -else");
      res.send("format error");
    }
  }
  console.log(" if - if -else");
  res.send("got your data ");
});

const storeToMongo = (data) => {
  console.log(data);
  dbConn.then(async (db) => {
    await new userSchema(data).save();
  });
  // collect.insertOne(data)
};

const getNotes = () => {
  console.log("tring to get data");
  dbConn.then((db) => {
    console.log(db)
    db.model()
    var dbo = db;
    /*  dbo.collection("notes").findOne({}, function(err, result) {
          console.log(err)
          if (err) throw err;
          console.log(result);
          dbConn.close();
        });     */
  })

}
// User model
const Notes = moongoose.model('notes', {
  blocks: Array
});

// Only one parameter [query/condition]
// Find all documents that matches the
// condition name='Punit'

var jsonToString = (docs) => {
  console.log(docs)
  for (var i = 0; i < 1; i++) {
    console.log("Block no ", i + 1);
    console.log(typeof docs[i].blocks)
    var lines = Object.values(docs[i].blocks)
    var text = "";
    var style = "";
    for (var j = 0; j < lines.length; j++) {

    }
    //console.log(docs[i].blocks);
  }
}
app.get("/get-notes", function (request, response) {

/*
  async.parallel([function(callback)],  function(err, results) {
    if(err) { console.log(err); res.send(500,"Server Error"); return; }
    res.send({api1:results[0], api2:results[1]});
  });*/
  Notes.find({}, function (err, docs) {
    if (err) {
      console.log(err);
    }
    else {
      // console.log("First function call : ", docs);
      jsonToString(docs);
    }
  });
  response.send("Hello Good Morning!");
});


app.get("/get-html",  function (_request, response) {
  var html_text = "";
  Notes.find().then((docs) => {
      var block1 = Object.values(docs)[4];
      for (var ith_line = 0; ith_line < block1.blocks.length; ith_line++) {
       // html_text += "<p>" + block1.blocks[ith_line].text + "</p><br/>"
      
        current_text=block1.blocks[ith_line].text;
        updating_text="";
      block_text = block1.blocks[0].text;
      block_text_length = block_text.length;
      block_styles = (block1.blocks[ith_line].inlineStyleRanges);
      let styleHashMap=new Map();
      for (var ith_style = 0; ith_style < block_styles.length; ith_style++) {

        style_type = block_styles[ith_style].style.split("-")[0];
        style_value = block_styles[ith_style].style.split("-")[1];
        offset_value=block_styles[ith_style].offset;
        style_length=block_styles[ith_style].length;
      
        switch (style_type) {
          case "color":
           // console.log("style_type color", style_value);
            if(styleHashMap.get(offset_value+"-"+style_length)){
              styleHashMap.set(offset_value+"-"+style_length,styleHashMap.get(offset_value+"-"+style_length)+" ;"+"color:"+style_value);}else
            styleHashMap.set(offset_value+"-"+style_length,"color:"+style_value);
            break;
          case "fontsize":
           // console.log("style_type fontsize", style_value);
            if(styleHashMap.get(offset_value+"-"+style_length)){
              styleHashMap.set(offset_value+"-"+style_length,styleHashMap.get(offset_value+"-"+style_length)+" ;"+"fontsize:"+style_value);}else
               styleHashMap.set(offset_value+"-"+style_length,"fontsize:"+style_value);
            break;
          case "fontfamily":
            if(styleHashMap.get(offset_value+"-"+style_length)){
              styleHashMap.set(offset_value+"-"+style_length,styleHashMap.get(offset_value+"-"+style_length)+" ;"+"fontfamily:"+style_value);}else
               styleHashMap.set(offset_value+"-"+style_length,"fontfamily:"+style_value);
            break;
          case "BOLD":
            //console.log("style_type BOLD" );
            if(styleHashMap.get(offset_value+"-"+style_length)){
              styleHashMap.set(offset_value+"-"+style_length,styleHashMap.get(offset_value+"-"+style_length)+" ;"+"font-weight: bold:");}else
               styleHashMap.set(offset_value+"-"+style_length,"font-weight: bold;:");
            break;
          case "ITALIC":
           // console.log("style_type ITALIC");
            if(styleHashMap.get(offset_value+"-"+style_length)){
              styleHashMap.set(offset_value+"-"+style_length,styleHashMap.get(offset_value+"-"+style_length)+" ;"+"font-style: italic:");}
              else
                styleHashMap.set(offset_value+"-"+style_length,"font-style: italic:");
            
            break;
          case "CODE":
           // console.log("style_type CODE");
            styleHashMap.set(offset_value+"-"+style_length,"font-weight: bold; background-color: rgb(230, 230, 230)");
            
            break;
          default:
            //console.log(style_type, style_value);
            break;
        }
      }
     // console.log("style hashmap ",styleHashMap);
      var lastOffset=0;
      var lastrange=0;
      for (const [key, value] of styleHashMap.entries()) {
       // console.log(key, value);
        var [from,to]=key.split("-");//console.log("updating_text before ",updating_text)
        from=parseInt(from);
        to=parseInt(to);
        if(lastOffset+lastrange<=from)
        {
          updating_text+="<span>"+current_text.substring(lastOffset+lastrange,from)+"</span>";
        }
        updating_text+="<span style='"+value+"'>"+current_text.substring(from,from+to)+"</span>";
       // console.log("updating_text after ",updating_text);
        lastOffset=from;
        lastrange=to;
      }
      //console.log(updating_text);
      current_text="<p style:padding:0px margin:0px>"+updating_text+"</p><br/>";
      html_text +=current_text;
     
    }
   console.log("html_text",html_text);
 response.send({ "name": html_text });
  }).catch(err => console.log(err));
  
  // console.log("denil  var html_text", html_text);
 
});

app.listen(10000, function () {
  console.log("Started application on port %d", 10000);
});
