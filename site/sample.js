// Reading sample using the original dataset fields rendered by BlueCard.jsx.
// It does not reproduce Fuse search, favorites or export and has no persistence.
const words=JSON.parse(document.querySelector('#word-data').textContent);
const fields={'word-cn':'中文','word-en':'英文','word-definition':'释义','word-paraphrase':'英文释义','word-credit':'出处'};
const buttons=[...document.querySelectorAll('[data-word]')];
buttons.forEach(button=>button.addEventListener('click',()=>{
  const word=words[Number(button.dataset.word)];
  for(const [id,key] of Object.entries(fields))document.getElementById(id).textContent=word[key]||'';
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
}));
