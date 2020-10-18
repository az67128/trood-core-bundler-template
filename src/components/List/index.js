import React from 'react';
import { useObserver } from 'mobx-react-lite';
import BaseComponent from 'core/BaseComponent';
import { Component } from 'core/pageStore/index.js';

const List = ({
    entity,
    components,
    bottomComponents = [
        { name: 'Button', props: { children: 'prev!!', onClick: { $type: '$data', path: '$context.prevPage' } } },
        { name: 'Button', props: { children: 'next!!', onClick: { $type: '$data', path: '$context.nextPage' } } },
    ],
    topComponents = [
        { name: 'Button', props: { children: 'prev!!', onClick: { $type: '$data', path: '$context.prevPage' } } },
        { name: 'Button', props: { children: 'next!!', onClick: { $type: '$data', path: '$context.nextPage' } } },
    ],
}) => {
    const [page, setPage] = React.useState(0);
    const componentsStore = Component.create({ components });
    const bottomComponentsStore = Component.create({ components: bottomComponents });
    const topComponentsStore = Component.create({ components: topComponents });

    const nextPage = () => setPage(page + 1);
    const prevPage = () => setPage(page === 0 ? 0 : page + 1);
    return useObserver(() => (
        <div>
            {topComponents && (
                <BaseComponent $context={{ nextPage, prevPage }} components={topComponentsStore.components} />
            )}
            {entity.getPage(page, 5).map((item) => (
                <BaseComponent key={item.name} $context={item} components={componentsStore.components} />
            ))}
           
            {bottomComponents && (
                <BaseComponent $context={{ nextPage, prevPage }} components={bottomComponentsStore.components} />
            )}
        </div>
    ));
};

export default List;
