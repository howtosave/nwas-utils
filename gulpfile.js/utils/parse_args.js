
const parse_args = (args) => {
  const result = {};
  let curKey = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      curKey = arg.substring(2);
    }
    else if (curKey) {
      result[curKey] = arg;
      curKey = null;
    }
  }
  return result;
};

module.exports = parse_args;
