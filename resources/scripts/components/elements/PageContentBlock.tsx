import React, { useEffect } from 'react';
import ContentContainer from '@/components/elements/ContentContainer';
import { CSSTransition } from 'react-transition-group';
import tw from 'twin.macro';
import FlashMessageRender from '@/components/FlashMessageRender';

export interface PageContentBlockProps {
    title?: string;
    className?: string;
    showFlashKey?: string;
}

const PageContentBlock: React.FC<PageContentBlockProps> = ({ title, showFlashKey, className, children }) => {
    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [title]);

    return (
        <CSSTransition timeout={150} classNames={'fade'} appear in>
            <>
                <ContentContainer css={tw`mb-4 sm:mb-10 mt-4`} className={className}>
                    {showFlashKey && <FlashMessageRender byKey={showFlashKey} css={tw`mb-4`} />}
                    {children}
                </ContentContainer>
                <ContentContainer css={tw`mb-4`}>
                    <p css={tw`text-center text-neutral-500 text-xs`}>
                        <a rel={'noopener nofollow noreferrer'} href={'https://iceline.host'} target={'_blank'} css={tw`no-underline text-neutral-500 hover:text-neutral-300`}>
                            Iceline Hosting
                        </a>
                        &nbsp;{(window as any).panelIdentifier ? '| ' + (window as any).panelIdentifier : ''}
                    </p>
                </ContentContainer>
            </>
        </CSSTransition>
    );
};

export default PageContentBlock;
