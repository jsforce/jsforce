
import * as _ from 'lodash';

import {
    State,
    Subscription,
    SalesforceGetAccountsStatusesResponse,
} from '../../models';
import { config } from '../../config';
import { newErrors as errors } from '../../errors';
import * as remote from './remote';

let jsforce;
let connection;

if (config.params.mockSalesforceApi) {
    jsforce = require('./remote/mock').jsforce;
} else {
    jsforce = require('jsforce');
}

export async function initPromise(state: State) {
    try {
        connection = await remote.getConnection(config.salesforceApi, state);
        state.logger.debug('login successful');
    } catch (err) {
        const msg = 'Could not connect to Salesforce API.';
        state.logger.error({ err }, msg);
        throw errors.badGateway('Salesforce Remote Connection Error');
    }
}

export async function notifyKeyDate(subscription: Subscription, state: State): Promise<string> {
    try {
        const response = await remote.notifyKeyDate(subscription);
        return response;
    } catch (error) {
        state.logger.error({ error, response: _.pick(_.get(error, 'response'), ['status']) }, 'Salesforce Remote Notify Error');
        throw errors.badGateway('Salesforce Remote Notify Error');
    }
}

export async function getAccountsStatuses(crmIds: string[], state: State): Promise<SalesforceGetAccountsStatusesResponse> {
    try {
        const response = await remote.getAccountsStatuses(crmIds);
        return <SalesforceGetAccountsStatusesResponse>response;
    } catch (error) {
        state.logger.error({ error, response: _.pick(_.get(error, 'response'), ['status']) }, 'Salesforce Remote Get Data Query Error');
        throw errors.badGateway('Salesforce Remote Get Data Query Error');
    }
}
