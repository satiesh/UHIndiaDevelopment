/**
 * @author satiesh darmaraj
 * created on 09/14/2020
 */
import { template } from '@app/models';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface State extends EntityState<template> {
  isTemplateLoading?: boolean;
  isTemplateLoaded?: boolean;
  error?: any;
}
export const adapter: EntityAdapter<template> = createEntityAdapter<template>();

export const initialState: State = adapter.getInitialState({
  isTemplateLoading: false,
  isTemplateLoaded: false,
  error: null
});
