// db.memberlegislatives.createIndex({
//   "basic_info.name": "text",
//   "basic_info.surname": "text",
//   "basic_info.party": "text",
//   "basic_info.constituency": "text",
// });

// db.memberlegislatives.find({
//   $or: [
//     { "basic_info.name": req.params.id },
//     { "basic_info.surname": req.params.id },
//     { "basic_info.party": req.params.id },
//     { "basic_info.constituency": req.params.id },
//   ],
// });
