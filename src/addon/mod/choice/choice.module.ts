// (C) Copyright 2015 Martin Dougiamas
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { NgModule } from '@angular/core';
import { CoreCronDelegate } from '@providers/cron';
import { CoreContentLinksDelegate } from '@core/contentlinks/providers/delegate';
import { CoreCourseModuleDelegate } from '@core/course/providers/module-delegate';
import { CoreCourseModulePrefetchDelegate } from '@core/course/providers/module-prefetch-delegate';
import { AddonModChoiceComponentsModule } from './components/components.module';
import { AddonModChoiceModuleHandler } from './providers/module-handler';
import { AddonModChoiceProvider } from './providers/choice';
import { AddonModChoiceLinkHandler } from './providers/link-handler';
import { AddonModChoicePrefetchHandler } from './providers/prefetch-handler';
import { AddonModChoiceSyncProvider } from './providers/sync';
import { AddonModChoiceSyncCronHandler } from './providers/sync-cron-handler';
import { AddonModChoiceOfflineProvider } from './providers/offline';
import { CoreUpdateManagerProvider } from '@providers/update-manager';

// List of providers (without handlers).
export const ADDON_MOD_CHOICE_PROVIDERS: any[] = [
    AddonModChoiceProvider,
    AddonModChoiceSyncProvider,
    AddonModChoiceOfflineProvider
];

@NgModule({
    declarations: [
    ],
    imports: [
        AddonModChoiceComponentsModule
    ],
    providers: [
        AddonModChoiceProvider,
        AddonModChoiceSyncProvider,
        AddonModChoiceOfflineProvider,
        AddonModChoiceModuleHandler,
        AddonModChoicePrefetchHandler,
        AddonModChoiceLinkHandler,
        AddonModChoiceSyncCronHandler
    ]
})
export class AddonModChoiceModule {
    constructor(moduleDelegate: CoreCourseModuleDelegate, moduleHandler: AddonModChoiceModuleHandler,
            prefetchDelegate: CoreCourseModulePrefetchDelegate, prefetchHandler: AddonModChoicePrefetchHandler,
            contentLinksDelegate: CoreContentLinksDelegate, linkHandler: AddonModChoiceLinkHandler,
            cronDelegate: CoreCronDelegate, syncHandler: AddonModChoiceSyncCronHandler, updateManager: CoreUpdateManagerProvider) {
        moduleDelegate.registerHandler(moduleHandler);
        prefetchDelegate.registerHandler(prefetchHandler);
        contentLinksDelegate.registerHandler(linkHandler);
        cronDelegate.register(syncHandler);

        // Allow migrating the tables from the old app to the new schema.
        updateManager.registerSiteTableMigration({
            name: 'mma_mod_choice_offline_responses',
            newName: AddonModChoiceOfflineProvider.CHOICE_TABLE,
            fields: [
                {
                    name: 'responses',
                    type: 'object'
                },
                {
                    name: 'deleting',
                    type: 'boolean'
                }
            ]
        });
    }
}
