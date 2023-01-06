import React, { useEffect, useState } from 'react';
import { Server } from '@/api/server/getServer';
import getServers from '@/api/getServers';
import Spinner from '@/components/elements/Spinner';
import PageContentBlock from '@/components/elements/PageContentBlock';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { usePersistedState } from '@/plugins/usePersistedState';
import Switch from '@/components/elements/Switch';
import tw from 'twin.macro';
import useSWR from 'swr';
import { PaginatedResult } from '@/api/http';
import Pagination from '@/components/elements/Pagination';
import { useLocation } from 'react-router-dom';

import ServerBox from '@/components/iceline/dashboard/ServerBox';
import SearchModal from '@/components/dashboard/search/SearchModal';

export default () => {
    const { search } = useLocation();
    const defaultPage = Number(new URLSearchParams(search).get('page') || '1');

    const [page, setPage] = useState(!isNaN(defaultPage) && defaultPage > 0 ? defaultPage : 1);
    const [searchVisible, setSearchVisible] = useState(false);

    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const uuid = useStoreState((state) => state.user.data!.uuid);
    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const [showOnlyAdmin, setShowOnlyAdmin] = usePersistedState(`${uuid}:show_all_servers`, false);

    const { data: servers, error } = useSWR<PaginatedResult<Server>>(['/api/client/servers', showOnlyAdmin && rootAdmin, page], () =>
        getServers({ page, type: showOnlyAdmin && rootAdmin ? 'admin' : undefined, include: 'egg' })
    );

    useEffect(() => {
        if (!servers) return;
        if (servers.pagination.currentPage > 1 && !servers.items.length) {
            setPage(1);
        }
    }, [servers?.pagination.currentPage]);

    useEffect(() => {
        // Don't use react-router to handle changing this part of the URL, otherwise it
        // triggers a needless re-render. We just want to track this in the URL incase the
        // user refreshes the page.
        window.history.replaceState(null, document.title, `/${page <= 1 ? '' : `?page=${page}`}`);
    }, [page]);

    useEffect(() => {
        if (error) clearAndAddHttpError({ key: 'dashboard', error });
        if (!error) clearFlashes('dashboard');
    }, [error]);

    return (
        <PageContentBlock title={'Dashboard'} showFlashKey={'dashboard'}>
            {searchVisible && <SearchModal appear visible={searchVisible} onDismissed={() => setSearchVisible(false)} />}
            <div css={tw`flex flex-row items-center justify-between mb-6`}>
                <a css={tw`flex flex-row items-center text-sm cursor-pointer`} style={{ color: '#9092a7' }} onClick={() => setSearchVisible(true)}>
                    <img css={tw`mr-2`} src={'/assets/iceline/servers/search.svg'} alt={'search'} />
                    <span>Search</span>
                </a>
                {rootAdmin && (
                    <div css={tw`flex justify-end items-center`}>
                        <p css={tw`uppercase text-xs text-neutral-400 mr-2`}>{showOnlyAdmin ? "Showing other's servers" : 'Showing your servers'}</p>
                        <Switch name={'show_all_servers'} defaultChecked={showOnlyAdmin} onChange={() => setShowOnlyAdmin((s) => !s)} />
                    </div>
                )}
            </div>
            {!servers ? (
                <Spinner centered size={'large'} />
            ) : (
                <Pagination data={servers} onPageSelect={setPage}>
                    {({ items }) =>
                        items.length > 0 ? (
                            <div css={tw`grid grid-cols-1 lg:grid-cols-2 gap-4`}>
                                {items.map((server, index) => (
                                    <ServerBox key={server.uuid} server={server} css={index > 0 ? tw`mt-2` : undefined} />
                                ))}
                            </div>
                        ) : (
                            <p css={tw`text-center text-sm text-neutral-400`}>
                                {showOnlyAdmin ? 'There are no other servers to display.' : 'There are no servers associated with your account.'}
                            </p>
                        )
                    }
                </Pagination>
            )}
        </PageContentBlock>
    );
};
