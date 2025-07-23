declare module 'pinia' {
  import { ComponentCustomProperties, App } from 'vue'
  import { Store } from 'pinia'

  export function createPinia(): Pinia
  export interface Pinia {
    install(app: App): void
    state: any
  }

  export function defineStore<Id extends string, S, G, A>(id: Id, options: any): any
  export function defineStore<Id extends string, S, G, A>(options: { id: Id } & any): any
  export function defineStore<Id extends string, SS>(id: Id, storeSetup: () => SS, options?: any): any

  declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
      $store: Store<string>
    }
  }
}