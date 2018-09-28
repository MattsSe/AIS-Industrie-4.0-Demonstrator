import { Container, inject, interfaces } from "inversify";
import { autoProvide, makeProvideDecorator, makeFluentProvideDecorator } from "inversify-binding-decorators";

const iocContainer = new Container();

const provide = makeProvideDecorator(iocContainer);
const fluentProvider = makeFluentProvideDecorator(iocContainer);

const provideNamed = function(
    identifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>,
    name: string
) {
    return fluentProvider(identifier)
        .whenTargetNamed(name)
        .done();
};

const provideSingleton = function(
    identifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>
) {
    return fluentProvider(identifier)
        .inSingletonScope()
        .done();
};

export { iocContainer, autoProvide, provide, provideNamed, inject, provideSingleton };