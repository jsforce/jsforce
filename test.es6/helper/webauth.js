import { isNodeJS } from './env';
import nodeAuthorize from './node/webauth';
import browserAuthorize from './browser/webauth';

const authorize = isNodeJS() ? nodeAuthorize : browserAuthorize;

export default authorize;
