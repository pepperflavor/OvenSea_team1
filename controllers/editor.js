// const { Nft } = require("../models");

const editor = require("../models/editor");


exports.getAddEditor = (req, res, next)=> {
    if (req.body.editorName === ""){
        console.log(" 등록할 작가이름을 입력하세요");
        res.send(" 등록할 작가이름을 입력하세요");
    } else if (!(req.body.editorName === "")) {
      res.render("/editor/editor-apply", {
        path: "/editor/editor-apply",
      });
    }
};

exports.postEditorName = (req, res, next)=>{
    const applyUid = req.session.uid;
    const applyId = req.session.id;
    const editorName = req.body.editorName;
    editor.create({
      id: applyId,
      uid: applyUid,
      editorName: editorName,
    });
    res.redirect('/');
}

