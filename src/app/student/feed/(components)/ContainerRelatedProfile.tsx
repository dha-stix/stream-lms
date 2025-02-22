import RelatedProfile from "./RelatedProfile";

export default function ContainerRelatedProfile({
	relatedProfiles,
	userID
}: {
		relatedProfiles: InstructorProps[] | null;
	userID: string
}) {
	return (
		<section>
			<h3 className='font-bold text-lg mb-4'>Related Profiles</h3>

			<div className='flex flex-col space-y-4'>
				{relatedProfiles && relatedProfiles.length > 0 ? (
					relatedProfiles?.map((profile, index) => (
						<RelatedProfile key={index} {...profile} userID={userID} />
					))
				) : (
					<p className='text-xs opacity-60 '>No related profiles found</p>
				)}
			</div>
		</section>
	);
}