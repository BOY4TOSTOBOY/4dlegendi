import * as moment from 'moment';
import * as _ from 'lodash';


export function serializeType<T>(object: T) {
  return function () { return object; };
}

export function formatDateToPlain() {
  return value => value ? moment(value).format('YYYY-MM-DD') : value;
}

export function formatDateToPlain2() {
  return value => moment(value).format();
}

export function formatDateToClass() {
  return value => value ? moment(value) : value;
}

export function momentToString() {
  // return value => value;
  return value => value ? moment(value).format('YYYY-MM-DD HH:mm') : value;
}

export function stringToMoment() {
  return value => value ? moment(value) : value;
}

export function momentToString2() {
  return value => value ? value.toString() : value;
}

export function yearToMoment() {
  return value => value ? value : moment().format('YYYY');
}

export function mapRemovalActDocuments() {
  return value => value.map(document => document.id);
}

export function sortDocumentAssessments() {
  return assessments => assessments.sort((a, b) => a.id - b.id);
}

export function sortDocumentActivities() {
  return documentActivities => documentActivities.length ? documentActivities.sort((a, b) => a.id - b.id) : documentActivities;
}

export function booleanTransform() {
  return value => value ? value : false;
}

export function documentTsTaskIndexMainTaskTransform(type: 'toPlain' | 'toClass') {
  if (type === 'toPlain') {
    return value => value.join(', ');
  } if (type === 'toClass') {
    return value => {
      if (value) {
        if (_.isString(value)) {
          return value.split(', ');
        } else if (_.isArray(value)) {
          return value;
        }
        return [];
      } else {
        return [];
      }
    }
  }
}
