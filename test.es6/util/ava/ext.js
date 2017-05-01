import test from 'ava';


function makeGroupedFn(origFn, scope, groupTitle) {
  return (title, ...args) => (
    typeof title === 'string' && groupTitle ?
    origFn.call(scope, `${groupTitle} : ${title}`, ...args) :
    origFn.call(scope, title, ...args)
  );
}

const testFnNames = [
  'serial', 'cb', 'only', 'skip', 'todo', 'failing',
  'before', 'after', 'beforeEach', 'afterEach',
];

function createGroupedTest(origTest, groupTitle = null) {
  const extTest = makeGroupedFn(origTest, null, groupTitle);
  testFnNames.forEach((fname) => {
    extTest[fname] = makeGroupedFn(origTest[fname], origTest, groupTitle);
  });
  extTest.group = (nextGroupTitle, callback) => {
    callback(createGroupedTest(extTest, nextGroupTitle));
  };
  return extTest;
}

export default createGroupedTest(test);
