import test from 'ava';

const testFnNames = [
  'cb', 'only', 'skip', 'todo', 'failing',
  'before', 'after', 'beforeEach', 'afterEach',
];

function makeGroupedFn(origFn, scope, groupTitle, level = 1) {
  if (level === 0) { return origFn; }
  const groupedFn = (title, ...args) => (
    typeof title === 'string' && groupTitle ?
    origFn.call(scope, `${groupTitle} : ${title}`, ...args) :
    origFn.call(scope, title, ...args)
  );
  testFnNames.forEach((fname) => {
    groupedFn[fname] = makeGroupedFn(origFn[fname], origFn, groupTitle, level - 1);
  });
  return groupedFn;
}

function createGroupedTest(origTest, groupTitle = null) {
  const extTest = makeGroupedFn(origTest, null, groupTitle);
  extTest.group = (nextGroupTitle, callback) => {
    callback(createGroupedTest(extTest, nextGroupTitle));
  };
  return extTest;
}

export default createGroupedTest(test.serial);
