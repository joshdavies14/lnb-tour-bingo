import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const InfoModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal title="How to play" isOpen={isOpen} handleClose={handleClose}>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Time to play competition bingo! Something happen in a competition that
        is in your grid below? Tap it to tick it off! Once the competition ends,
        share with other people in the club to see how well you all did.
      </p>
    </BaseModal>
  )
}
