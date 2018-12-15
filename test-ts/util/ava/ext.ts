import test from 'ava';

const testFnNames = [
  'cb', 'only', 'skip', 'todo', 'failing',
  'before', 'after', 'beforeEach', 'afterEach',
];

type TestInterface = typeof test.serial;

type GroudpedTestInterface = TestInterface & {
  group: (title: string, callback: (test: TestInterface) => any) => void,
};


function makeGroupedFn(
  origFn: TestInterface,
  scope: any,
  groupTitle: string | void | null,
  level: number = 1,
): GroudpedTestInterface {
  if (level === 0) { return origFn as any; }
  const groupedFn: any = (title: string, ...args: any[]) => (
    typeof title === 'string' && groupTitle ?
    origFn.call(scope, `${groupTitle} : ${title}`, ...args) :
    origFn.call(scope, title, ...args)
  );
  testFnNames.forEach((fname) => {
    groupedFn[fname] = makeGroupedFn((origFn as any)[fname], origFn, groupTitle, level - 1);
  });
  return groupedFn;
}

function createGroupedTest(
  origTest: TestInterface,
  groupTitle: string | void | null = null,
): GroudpedTestInterface {
  const extTest = makeGroupedFn(origTest, null, groupTitle);
  extTest.group = (nextGroupTitle, callback) => {
    callback(createGroupedTest(extTest, nextGroupTitle));
  };
  return extTest;
}

export default createGroupedTest(test.serial);
