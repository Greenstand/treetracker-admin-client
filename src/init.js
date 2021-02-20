/*
 * do some which must be executed as early as possible
 */
import * as loglevel		from 'loglevel'

/*
 * set the global configuration for loglevel
 * it should be set as early as possible
 */
loglevel.setDefaultLevel('debug')
