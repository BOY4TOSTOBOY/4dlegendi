import {HttpParams} from '@angular/common/http';
import * as _ from 'lodash';
import {plainToClass} from 'class-transformer';

export function prepareQuery(params?: any) {
  _.forOwn(params, (value, key) => {
    if (value === null || value === '') {
      delete params[key];
    }
  });

  let newParams = new HttpParams();

  if (!_.isEmpty(params)) {
    const keys = Object.keys(params);
    keys.forEach(key => {
      newParams = newParams.append(key, params[key]);
    });
  }

  return newParams;
}

export function getFormData(object: Object) {
  const formData = new FormData();
  Object.keys(object).forEach(key => formData.append(key, object[key]));

  return formData;
}


export function prepareFilteredArray(filteredArray: any[], uniqParams: string, selectedValue: any): any[] {
  if (selectedValue && selectedValue[uniqParams]) {
    filteredArray = [selectedValue].concat(filteredArray);

    return _.uniqBy(filteredArray, uniqParams);
  }

  return filteredArray;
}

export function fromDictToId(object, fields, type) {
  if (type === 'single') {
    fields.forEach(field => {
      if (object[field]) {
        object[field] = object[field].id;
      }
    });
  } else if (type === 'array') {
    fields.forEach(field => {
      if (object[field]) {
        if (object[field].length) {
          object[field] = object[field].map( item => item.id);
        }
      }
    });
  }

  return object;
}

export function prepareAndDownloadFile(response: any, type: string, filenameRegex: RegExp = /"(.*?)"/): Blob {
  const contentDispositionHeader = decodeURIComponent(response.headers.get('content-disposition'));
  const splitContentDispositionHeader = contentDispositionHeader.split('; ');

  let filename = '';
  if (splitContentDispositionHeader.length === 2) {
    filename = filenameRegex.exec(splitContentDispositionHeader[1])[1];
  } else {
    filename = splitContentDispositionHeader[2].slice(17,);
  }

  const fileURL = URL.createObjectURL(response.body);
  const anchor = document.createElement('a');
  document.body.appendChild(anchor);
  anchor.download = filename;
  anchor.href = fileURL;
  anchor.target = '_self';
  anchor.click();
  anchor.remove();

  return new Blob([response.body], {type});
}

export function serializeResponse(type: string, response: any, model: any) {
  if (type === 'array') {
    response.results = plainToClass(model, response.results as Object[]);

    return response;
  } else if (type === 'single') {
    return plainToClass(model, response);
  }
}
