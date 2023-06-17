/**
 * @see figma  https://www.figma.com/plugin-docs/manifest/
 * @see mg https://developers.mastergo.com/guide/setup.html
 */
declare interface Manifest {
  name: string;
  id?: string;
  main: string;
  api: string;
  ui?: string | Record<string, string>;
  parameters?: Parameter[];
  parameterOnly?: boolean;
  editorType: ('figma' | 'figjam')[];
  menu?: ManifestMenuItem[];
  relaunchButtons?: ManifestRelaunchButton[];
  enableProposedApi?: boolean;
  enablePrivatePluginApi?: boolean;
  build?: string;
  permissions?: PluginPermissionType[]
}

interface Parameter {
  name: string
  key: string
  description?: string
  allowFreeform?: boolean
  optional?: boolean
}

type ManifestMenuItem =
  | { name: string; command: string }
  | { separator: true }
  | { name: string; menu: ManifestMenuItem[] };

interface ManifestRelaunchButton {
  command: string;
  name: string;
  multipleSelection?: boolean;
}

type PluginPermissionType =
  'currentuser' |
  'activeusers'
