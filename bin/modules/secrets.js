const zeit = require('./zeit');
const secrets = require(`../../credientials.json`);

module.exports = () => {
  const normalized = Object.keys(secrets)
    .map(s => {
      const slug = s.replace(/_+/g, '-').toLowerCase();
      return [s, slug, secrets[s]];
    });
  console.log(normalized)
  normalized.forEach(([key, slug, val]) => 
    zeit.secrets(slug, val));
};