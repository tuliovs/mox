'use strict';

const _createLassoConfig = require('./createLassoConfig');

exports.name = 'lasso';

exports.install = (pluginContext) => {
  Object.assign(pluginContext.models.Project.properties, {
    lassoConfig: {
      type: pluginContext.models.Raw,
      description: 'Lasso configuration'
    }
  });
};

exports.beforeStart = (project) => {
  let logger = project.logger('lasso');

  let lassoConfig = _createLassoConfig(project, project.getLassoConfig());
  require('lasso').configure(lassoConfig);

  logger.info('Configured default lasso');

  project.setLassoConfig(lassoConfig);
};
